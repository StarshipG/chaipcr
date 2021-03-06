# wrapper for Fortran subroutine `supsmu` (Friedman 1984)

const libsupsmu = "$LOAD_FROM_DIR/_supsmu.so"

function supsmu(
    X::AbstractVector,
    Y::AbstractVector,
    span::Real,
    wt::AbstractVector=ones(length(X)), # weight
    periodic::Bool=false,
    alpha_bass::Real=0, # controles high frequency (small span) penality used with automatic span selection (bass tone control). (alpha.le.0.0 or alpha.gt.10.0 => no effect.)
    x_sorted::Bool=true
    # IntT_Fortran::DataType=Int32, FloatT_Fortran::DataType=Float32 # Julia DataTypes of integer and float copatible with the Fortran subroutine `supsmu`
    )

    if ndims(X) > 1 || ndims(Y) > 1
        error("X and Y must be 1-dimension.")
    end

    n = length(X)

    if length(Y) != n
        error("X and Y must be equal in length.")
    end

    if n < 3
        warn("Lengths of X and Y are less than 3, no smoothing will be done.")
    end

    if span < 0 || span > 1
        error("`span` must be between 0 and 1.")
    end

    if periodic # X is assumed to be a periodic variable with values in the range (0.0,1.0) and period 1.0.
        if minimum(x) < 0 || maximum(x) > 1
            error("If X is assumed to be periodic, its values must be between 0 and 1.")
        end
        iper = 2
    else
        iper = 1
    end


    # check done


    FloatT_in = typeof(Y[1])

    if !x_sorted
        indice_sorted = sortperm(X)
        indice_back = sortperm(indice_sorted)
        X = X[indice_sorted]
        Y = Y[indice_sorted]
    end

    # convert types for compatibility with Fortran `supsmu`
    X, Y, span, wt, alpha_bass = map(
        var -> map(Float32, var),
        (Array(X), Array(Y), span, wt, alpha_bass) )
    n, iper = map(var -> Int32(var), (n, iper))

    # variables to be modified
    smo = zeros(Float32, n)
    sc = zeros(Float32, n, 7)

    # call Fortran subroutine `supsmu`
    ccall((:supsmu_, libsupsmu), Void, (
        Ref{Int32}, Ref{Float32}, Ref{Float32}, # n, X, Y
        Ref{Float32}, Ref{Int32}, # wt, iper
        Ref{Float32}, Ref{Float32}, # span, alpha_bass
        Ref{Float32}, Ref{Float32} # smo, sc
        ), # must be literal, cannot be variable(s) to be evaluated
        n, X, Y, wt, iper, span, alpha_bass, smo, sc
    ) # smo and sc change values but not

    # convert back to the DataType of input
    smo = map(FloatT_in, smo)

    return x_sorted ? smo : smo[indice_back]

end
