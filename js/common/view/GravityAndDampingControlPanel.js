// Copyright 2017, University of Colorado Boulder

/**
 * Node for the gravity control panel and combo box for planet gravity options.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );

  // strings
  var dampingString = require( 'string!MASSES_AND_SPRINGS/damping' );
  var lotsString = require( 'string!MASSES_AND_SPRINGS/lots' );
  var noneString = require( 'string!MASSES_AND_SPRINGS/none' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityValueString = require( 'string!MASSES_AND_SPRINGS/gravityValue' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityAndDampingControlPanel( model, listNodeParent, tandem, options ) {
    var self = this;
    this.options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 13,
      yMargin: 10,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      dampingVisible: false,
      hSlider: true
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    this.bodies = MassesAndSpringsModel.BODIES;
    MassesAndSpringsModel.BODIES.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'bodyLabel' )
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body
      } );
    } );

    // @public
    this.gravityProperty = model.gravityProperty;

    // @public
    this.bodyProperty = model.bodyProperty;

    // @private {read-only} manages the items associated with the gravity panel in a combo box
    var gravityComboBox = new ComboBox( bodyListItems, model.bodyProperty, listNodeParent, {
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 3,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    var sliderOptions = {
      majorTickLength: 10,
      minorTickLength: 5,
      titleFont: new PhetFont( 14 ),
      trackSize: new Dimension2( 120, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      visible: true,
      align: 'left',
      stroke: null,
      sliderIndent: 7,
      constrainValue: function( value ) {
        return Number( Util.toFixed( value, 1 ) );
      }
    };

    var gravitySliderOptions = {
      majorTickLength: 10,
      titleFont: new PhetFont( 14 ),
      trackSize: new Dimension2( 125, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      stroke: null,
      sliderIndent: 7,
      constrainValue: function( value ) {
        return Number( Util.toFixed( value, 1 ) );
      },
      majorTicks: [
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.min,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.min ), { font: new PhetFont( 14 ) } )
        },
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.max,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.max ), { font: new PhetFont( 12 ) } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction1( {
        titleXSpacing: 70,
        ySpacing: 2,
        arrowButtonsXSpacing: 5
      } ),
      valuePattern: StringUtils.fillIn( gravityValueString, {
        gravity: '{0}'
      } ),
      useRichText: true,
      decimalPlaces: 1,
      arrowButtonScale: 0.5
    };

    // Manages the values associated with the gravity panel in a combo box
    var gravityHSlider = new NumberControl( gravityString, model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value, gravitySliderOptions );

    this.gravityNumberDisplay = new NumberDisplay( model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get(), {
      align: 'center',
      valuePattern: StringUtils.fillIn( gravityValueString, {
        gravity: '{0}'
      } ),
      useRichText: true,
      font: MassesAndSpringsConstants.FONT,
      decimalPlaces: 1,
      xMargin: 3,
      yMargin: 1,
      numberFill: 'black'
    } );

    if ( options.dampingVisible ) {

      var dampingRange = MassesAndSpringsConstants.DAMPING_RANGE_PROPERTY.get();
      var dampingHSlider = new HSlider( model.dampingProperty, dampingRange, sliderOptions );
      dampingHSlider.align = 'left';

      dampingHSlider.addMajorTick( dampingRange.min, new Text( noneString ) );
      dampingHSlider.addMajorTick( dampingRange.min + ( dampingRange.max - dampingRange.min ) / 2 );
      dampingHSlider.addMajorTick( dampingRange.max, new Text( lotsString ) );
      for ( var i = 1; i < 10; i++ ) {
        if ( i !== 5 ) {
          dampingHSlider.addMinorTick( dampingRange.min + i * ( dampingRange.max - dampingRange.min ) / 10 );
        }
      }

      // Used to format slider for damping
      var dampingControlPanel = new SpringControlPanel(
        model.dampingProperty,
        dampingRange,
        dampingString,
        [
          new Text( noneString, { font: MassesAndSpringsConstants.FONT } ),
          new Text( lotsString, { font: MassesAndSpringsConstants.FONT } )
        ],
        tandem,
        sliderOptions
      );
      Panel.call( self, new VBox( {
        align: 'center',
        spacing: 8,
          children: [
            gravityHSlider,
            gravityComboBox,
            dampingControlPanel
          ],
          tandem: tandem.createTandem( 'gravityPropertyVBox' )
        }
      ), self.options );
    }
    else {
      Panel.call( self, new VBox( {
        align: 'center',
        spacing: 8,
        children: [
          // this.gravityNumberDisplay,
          gravityHSlider,
          gravityComboBox
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } ), self.options );
    }

    model.bodyProperty.link( function( newBody, previousBody ) {
      var body = _.find( self.bodies, newBody );

      // Unhide the gravityHSlider if we are not using planetX
      if ( newBody !== Body.PLANET_X ) {
        gravityHSlider.visible = true;
      }

      // If PlanetX hide the slider and update gravity
      if ( newBody === Body.PLANET_X ) {
        gravityHSlider.visible = false;
        self.gravityProperty.set( body.gravity );
      }

      //  If we switched from PlanetX to Custom, display the last known non-planetX gravity.
      else if ( previousBody === Body.PLANET_X && newBody === Body.CUSTOM ) {
        self.gravityProperty.set( previousBody.gravity );
      }

      // Update gravity
      else if ( body.gravity || body === Body.ZERO_G ) {
        self.gravityProperty.set( body.gravity );
      }
    } );

    this.gravityProperty.link( function( newGravity ) {

      // If the user manually changed the gravity then change the body to CUSTOM.
      var selectedBody = model.bodyProperty.get();
      if ( selectedBody !== Body.CUSTOM && selectedBody.gravity !== newGravity ) {

        //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
        model.bodyProperty.set( Body.CUSTOM );
      }
    } );
    this.mutate( this.options );
  }

  massesAndSprings.register( 'GravityAndDampingControlPanel', GravityAndDampingControlPanel );

  return inherit( Panel, GravityAndDampingControlPanel );
} )
;
