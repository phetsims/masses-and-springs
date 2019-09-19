// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel that is responsible for adjusting the value of its corresponding mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const massString = require( 'string!MASSES_AND_SPRINGS/mass' );
  const massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  /**
   * @param {Mass} mass
   * @param {Node} massNodeIcon: icon that represents the mass to be adjusted
   * @param {Tandem} tandem
   * @param {object} options
   * @constructor
   */
  function MassValueControlPanel( mass, massNodeIcon, tandem, options ) {
    assert && assert( mass.adjustable === true, 'MassValueControlPanel should only adjust a mass that is adjustable.' );

    options = _.extend( {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      fill: 'white',
      align: 'center',
      stroke: 'gray',
      yMargin: 6,
      xMargin: 6,
      tandem: tandem
    }, options );

    // range for mass in kg
    var range = new Range( 50, 300 );

    var massInGramsProperty = new DynamicProperty( new Property( mass.massProperty ), {
      bidirectional: true,
      map: function( mass ) {
        return mass * 1000;
      },
      inverseMap: function( massInGrams ) {
        return massInGrams / 1000;
      }
    } );

    var trackSizeProperty = new Property( options.basics ? new Dimension2( 132, 0.1 ) : new Dimension2( 125, 0.1 ) );
    var valuePattern = StringUtils.fillIn( massValueString, { mass: SunConstants.VALUE_NAMED_PLACEHOLDER }, {
      font: new PhetFont( { size: 14, weight: 'bold' } )
    } );
    var numberControl = new NumberControl( massString, massInGramsProperty, range, {
      stroke: null,
      sliderIndent: 7,
      layoutFunction: NumberControl.createLayoutFunction4( {
        verticalSpacing: 8,
        arrowButtonsXSpacing: 5,
        hasReadoutProperty: new Property( true )
      } ),
      delta: 1,

      // subcomponent options
      numberDisplayOptions: {
        valuePattern: valuePattern,
        font: new PhetFont( 14 ),
        maxWidth: 100,
        useRichText: true,
        decimalPlaces: 0
      },
      titleNodeOptions: {
        font: new PhetFont( { size: 16, weight: 'bold' } ),
        maxWidth: 45
      },
      sliderOptions: {
        majorTickLength: 10,
        thumbSize: new Dimension2( 13, 24 ),
        thumbFill: '#00C4DF',
        thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
        thumbTouchAreaXDilation: 6,
        constrainValue: function( value ) { return ( Util.roundSymmetric( value / 10 ) * 10); },
        majorTicks: [
          {
            value: range.min,
            label: new Text( String( range.min ), { font: new PhetFont( 14 ) } )
          },
          {
            value: range.max,
            label: new Text( String( range.max ), { font: new PhetFont( 14 ) } )
          }
        ],
        trackSize: trackSizeProperty.value
      },
      arrowButtonOptions: {
        scale: 0.5,
        touchAreaXDilation: 16,
        touchAreaYDilation: 26
      }
    } );
    var contentNode = new Node( { children: [ numberControl, massNodeIcon ] } );

    Panel.call( this, contentNode, options );

    massNodeIcon.leftTop = numberControl.leftTop.plus( new Vector2( 45, -2 ) );
    massNodeIcon.pickable = false;
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );

  return inherit( Panel, MassValueControlPanel );
} );
